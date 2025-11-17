<?php

namespace App\Enums;

enum RoleName: string
{
    case ADMIN = 'admin';
    case AGENT = 'agent';
    case REPORTER = 'reporter';
}
