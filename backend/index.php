<?php

// Configuração CORS para os ambientes suportados
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['https://solvertank.tech'];

$originHost = '';
if (!empty($origin)) {
   $originHost = parse_url($origin, PHP_URL_HOST) ?: '';
}

$isLocalOrigin = in_array($originHost, ['localhost', '127.0.0.1'], true);

if (in_array($origin, $allowedOrigins, true) || $isLocalOrigin) {
   header("Access-Control-Allow-Origin: $origin");
} else {
   header('Access-Control-Allow-Origin: https://solvertank.tech');
}

header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_PRIVATE_NETWORK'])
   && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_PRIVATE_NETWORK'] === 'true') {
   header('Access-Control-Allow-Private-Network: true');
}

header('Content-Type: application/json; charset=utf-8');

// Responde a requisições preflight (OPTIONS) do CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Permite apenas o método POST; rejeita outros métodos com erro 405
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
	http_response_code(405);
	echo json_encode(['error' => 'Method Not Allowed']);
	exit;
}

// Lê e decodifica o corpo da requisição em formato JSON
$bodyData = file_get_contents('php://input');
$body = json_decode($bodyData, true);
if ($body === null) {
	http_response_code(400);
	echo json_encode(['error' => 'Invalid Body']);
	exit;
}

// Obtém o recurso solicitado a partir do corpo da requisição
$resource = isset($body['resource']) ? $body['resource'] : null;
if ($resource === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid Resource']);
    exit;
}

$openai_api_url = 'https://api.openai.com/v1/';
require_once __DIR__ . '/config.php';

// Roteamento para o arquivo correspondente ao recurso solicitado
if ($resource === 'responses_create_stream') {
   include 'inc_responses_create_stream.php';
} else if ($resource === 'person_create') {
   include 'inc_person_create.php';
} else {
   http_response_code(400);
   echo json_encode(['error' => 'Invalid Resource']);
}

