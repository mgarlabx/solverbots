<?php
// https://developers.openai.com/api/docs/guides/streaming-responses/

$instructions = '';
$input = [];

if (isset($body['instructions']) && $body['instructions'] !== null) {
	$instructions = trim((string) $body['instructions']);
}

if (isset($body['input']) && $body['input'] !== null) {
	$input = $body['input'];
}


$payload = [
	'model' => 'gpt-5.2',
	'instructions' => $instructions,
	'input' => $input,
	'tools' => [['type' => 'web_search']],
	'stream' => true,
];

// Override headers for Server-Sent Events streaming
header('Content-Type: text/event-stream; charset=utf-8');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no');

// Disable all output buffering
while (ob_get_level()) {
	ob_end_flush();
}

$url = $openai_api_url . 'responses';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
	'Content-Type: application/json',
	'Authorization: Bearer ' . $openai_api_key,
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);

// Stream chunks directly to the client as they arrive
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, $data) {
	echo $data;
	if (ob_get_level()) {
		ob_flush();
	}
	flush();
	return strlen($data);
});

$result = curl_exec($ch);
$curlError = curl_error($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($result === false) {
	echo "event: error\n";
	echo "data: " . json_encode(['error' => 'Failed to call OpenAI API', 'details' => $curlError]) . "\n\n";
	flush();
}
