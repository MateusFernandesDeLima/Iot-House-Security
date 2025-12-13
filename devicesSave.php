<?php
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'),true);

if (!$data || empty($data['name']) || empty($data['type']) || empty($data['location'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dados de dispositivo inválidos']);
    exit;
}

$file = 'devices.json';
$devices = [];

if (file_exists($file)) {
    $json = file_get_contents($file);
    $devices = $json ? json_decode($json, true) : [];
}

//Geração de ID
if (empty($data['id'])) {
    $maxId = 0;
    foreach ($devices as $d) {
        if ($d['id'] > $maxId) $maxId = $d['id'];
    }
    $data['id'] = $maxId + 1;
}

$data['lastUpdate'] = date('c');

$devices[] = $data;

file_put_contents($file, json_encode($devices, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(['success' => true, 'id' => $data['id']]);