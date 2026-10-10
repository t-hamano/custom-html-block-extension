// Start a headless Chrome on the Windows host and expose its CDP endpoint to WSL.
// WSL (NAT mode) can't reach Windows ports, but Windows can reach WSL ports, so a
// PowerShell relay connects Chrome's DevTools port to a local bridge here.
/**
 * External dependencies
 */
import net from 'node:net';
import { spawn, execFileSync } from 'node:child_process';

const CHROME = '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe';
const PS = '/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe';
const PROFILE_WIN = 'C:\\Temp\\chbe-capture-profile';
const CHROME_PORT = 9333;
const RELAY_PORT = 9444;

export async function startWindowsChrome() {
	killWindowsChrome();
	const chrome = spawn(
		CHROME,
		[
			'--headless=new',
			`--remote-debugging-port=${ CHROME_PORT }`,
			`--user-data-dir=${ PROFILE_WIN }`,
			'--force-device-scale-factor=1',
			'--no-first-run',
			'--no-default-browser-check',
			'about:blank',
		],
		{ stdio: 'ignore', detached: true }
	);
	chrome.unref();
	let wsPath;
	for ( let i = 0; i < 20 && ! wsPath; i++ ) {
		await new Promise( ( r ) => setTimeout( r, 500 ) );
		try {
			const json = execFileSync(
				PS,
				[
					'-NoProfile',
					'-Command',
					`(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:${ CHROME_PORT }/json/version).Content`,
				],
				{ encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ] }
			);
			wsPath = new URL( JSON.parse( json ).webSocketDebuggerUrl ).pathname;
		} catch {}
	}
	if ( ! wsPath ) {
		throw new Error( 'Chrome did not start' );
	}

	// Each Playwright connection waits for one relay connection from Windows.
	const pending = [];
	const relayServer = net.createServer( ( relay ) => {
		const client = pending.shift();
		if ( ! client ) {
			relay.destroy();
			return;
		}
		client.pipe( relay ).pipe( client );
		client.resume();
	} );
	await new Promise( ( r ) => relayServer.listen( RELAY_PORT, '127.0.0.1', r ) );
	const clientServer = net.createServer( ( client ) => {
		client.pause();
		pending.push( client );
		spawn(
			PS,
			[
				'-NoProfile',
				'-Command',
				`$c = New-Object Net.Sockets.TcpClient('127.0.0.1', ${ CHROME_PORT }); ` +
					`$w = New-Object Net.Sockets.TcpClient('127.0.0.1', ${ RELAY_PORT }); ` +
					'$a = $c.GetStream(); $b = $w.GetStream(); ' +
					'$t1 = $a.CopyToAsync($b); $t2 = $b.CopyToAsync($a); ' +
					'[Threading.Tasks.Task]::WaitAny(@($t1, $t2)) | Out-Null; $c.Close(); $w.Close()',
			],
			{ stdio: 'ignore' }
		);
	} );
	await new Promise( ( r ) => clientServer.listen( 0, '127.0.0.1', r ) );
	const endpoint = `ws://127.0.0.1:${ clientServer.address().port }${ wsPath }`;

	const stop = () => {
		relayServer.close();
		clientServer.close();
		killWindowsChrome();
	};
	return { endpoint, stop };
}

// Only the Chrome started with the capture profile is stopped.
export function killWindowsChrome() {
	execFileSync(
		PS,
		[
			'-NoProfile',
			'-Command',
			"Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | Where-Object { $_.CommandLine -like '*chbe-capture-profile*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }",
		],
		{ stdio: 'ignore' }
	);
}
