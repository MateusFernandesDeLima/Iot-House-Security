<?php
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID inválido']);
    exit;
}

$file = 'devices.json';

// Carrega lista atual
if (!file_exists($file)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Arquivo de dispositivos não encontrado']);
    exit;
}

$devices = json_decode(file_get_contents($file), true);
if (!is_array($devices)) {
    $devices = [];
}

// Remove pelo id
$id = (int)$data['id'];
$found = false;
$devices = array_filter($devices, function ($d) use ($id, &$found) {
    if (isset($d['id']) && (int)$d['id'] === $id) {
        $found = true;
        return false; // remove
    }
    return true; // mantém
});

// Salva de volta
if (file_put_contents($file, json_encode(array_values($devices), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar arquivo de dispositivos']);
    exit;
}

if (!$found) {
    echo json_encode(['success' => false, 'message' => 'Dispositivo não encontrado']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Dispositivo removido com sucesso']);