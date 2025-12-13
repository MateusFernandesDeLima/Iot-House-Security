<?php
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

sleep(2);

// Salva log (sempre)
$line = date('Y-m-d H:i:s') . " | {$data['name']} | {$data['email']} | " . ($data['subject'] ?? 'N/A') . " | OK\n";
file_put_contents('contact_log.txt', $line, FILE_APPEND);

echo json_encode([
    'success' => true,
    'message' => 'Mensagem registrada com sucesso!'
]);

?>