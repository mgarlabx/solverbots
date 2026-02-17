<?php

$url = $body['wikipedia_url'];

$input = <<<EOT
# PERSONA
Você é um autor de textos sobre personalidades da história.

# TAREFA
Você deve recuperar os dados de uma personalidade a partir do seguinte link: $url .
Você deve extrair as seguintes informações:
- Nome resumido
- Sexo
- Ano do nascimento
- Ano da morte
- País de origem
- Biografia

# BIOGRAFIA
- Inclua sua vida pessoal, principais conquistas e contribuições. 
- Não inclua a origem da informacão, referências ou links. 
- Escreva em 3000 caracteres, em um parágrafo único, sem quebras de linha. 
- Separe as frases por pontos, não use ponto-e-vírgula.

# IDIOMAS
- Os campos nome, país e biografia devem ser escritos em português, inglês e espanhol.

# FORMATO DE RESPOSTA
- A resposta deve ser um JSON conforme estrutura especificada.
EOT;


$schema = [
    'format' => [
        'type' => 'json_schema',
        'name' => 'person_data',
        'strict' => true,
        'schema' => [
            'type' => 'object',
            'properties' => [
                'id' => [
                    'type' => 'integer',
                    'description' => 'Identificador numérico da personalidade'
                ],
                'name_pt' => [
                    'type' => 'string',
                    'description' => 'Nome resumido em português'
                ],
                'name_en' => [
                    'type' => 'string',
                    'description' => 'Nome resumido em inglês'
                ],
                'name_es' => [
                    'type' => 'string',
                    'description' => 'Nome resumido em espanhol'
                ],
                'image' => [
                    'type' => 'string',
                    'description' => 'Slug da imagem da personalidade'
                ],
                'sex' => [
                    'type' => 'string',
                    'description' => 'Sexo biológico (M ou F)',
                    'enum' => ['M', 'F']
                ],
                'birth' => [
                    'type' => 'integer',
                    'description' => 'Ano de nascimento'
                ],
                'death' => [
                    'type' => ['integer', 'null'],
                    'description' => 'Ano de morte; null se ainda vivo'
                ],
                'country_pt' => [
                    'type' => 'string',
                    'description' => 'País de origem em português'
                ],
                'country_en' => [
                    'type' => 'string',
                    'description' => 'País de origem em inglês'
                ],
                'country_es' => [
                    'type' => 'string',
                    'description' => 'País de origem em espanhol'
                ],
                'biography_pt' => [
                    'type' => 'string',
                    'description' => 'Biografia em português (parágrafo único)'
                ],
                'biography_en' => [
                    'type' => 'string',
                    'description' => 'Biografia em inglês (parágrafo único)'
                ],
                'biography_es' => [
                    'type' => 'string',
                    'description' => 'Biografia em espanhol (parágrafo único)'
                ]
            ],
            'additionalProperties' => false,
            'required' => [
                'id',
                'name_pt',
                'name_en',
                'name_es',
                'image',
                'sex',
                'birth',
                'death',
                'country_pt',
                'country_en',
                'country_es',
                'biography_pt',
                'biography_en',
                'biography_es'
            ]
        ]
    ]
];



$payload = [
    'model' => 'gpt-5.2',
    'input' => $input,
    'text' => $schema,
];

$ch = curl_init($openai_api_url . 'responses');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $openai_api_key
]);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(['error' => 'cURL error: ' . curl_error($ch)]);
    exit;
}
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if ($httpCode !== 200) {
    echo json_encode(['error' => "API request failed with status code $httpCode: $response"]);
    exit;
}
curl_close($ch);


$response_json = json_decode($response, true);
$outputs = $response_json['output'] ?? [];
foreach ($outputs as $output) {
    if (($output['type'] ?? '') === 'message' && ($output['status'] ?? '') === 'completed') {
        $content = $output['content'][0]['text'] ?? '';
    }
}

echo json_encode(['message' => $content]);


