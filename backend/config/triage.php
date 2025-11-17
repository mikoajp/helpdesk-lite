<?php

return [
    'keywords' => [
        'high_priority' => [
            'urgent', 'critical', 'down', 'outage', 'broken', 'error 500',
            'cannot login', 'security', 'data loss', 'crash', 'fatal',
        ],
        'low_priority' => [
            'feature request', 'enhancement', 'nice to have', 'cosmetic',
            'minor', 'typo', 'documentation', 'suggestion',
        ],
        'resolution' => ['fixed', 'resolved', 'completed', 'done', 'solved'],
    ],
    'rules' => [
        'resolved_after_days' => 7,
    ],
];
