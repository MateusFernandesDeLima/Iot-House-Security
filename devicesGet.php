<?php
header('Content-Type: application/json; charset=utf-8');

$file = 'devices.json';

if (!file_exists($file)) {
    // lista inicial se não existir nada ainda (IA Generated)
    $devices = [
        [ 'id' => 1, 'name' => 'Câmera Principal', 'type' => 'camera', 'location' => 'Entrada', 'status' => 'online', 'batteryLevel' => 100, 'lastUpdate' => date('c') ],
        [ 'id' => 2, 'name' => 'Sensor de Movimento', 'type' => 'sensor', 'location' => 'Jardim', 'status' => 'online', 'batteryLevel' => 85, 'lastUpdate' => date('c') ],
        [ 'id' => 3, 'name' => 'Fechadura Inteligente', 'type' => 'lock', 'location' => 'Porta da Frente', 'status' => 'warning', 'batteryLevel' => 15, 'lastUpdate' => date('c') ],
    ];
    file_put_contents($file, json_encode($devices, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
} else {
    $json = file_get_contents($file);
    $devices = $json ? json_decode($json, true) : [];
}

echo json_encode($devices, JSON_UNESCAPED_UNICODE);