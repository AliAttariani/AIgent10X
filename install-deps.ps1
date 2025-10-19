Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Invoke-NpmCommand {
    param([string[]]$CommandArgs)
    Write-Host ""
    Write-Host ("Running: npm {0}" -f ($CommandArgs -join ' '))
    $outputBuffer = & npm @CommandArgs 2>&1
    $exitCode = $LASTEXITCODE
    if (-not $outputBuffer) {
        $outputBuffer = @()
    }
    foreach ($line in $outputBuffer) {
        Write-Host $line
    }
    return [PSCustomObject]@{
    ExitCode = $exitCode
    Output  = $outputBuffer
    }
}

function Invoke-NpmWithRetry {
    param([string[]]$Arguments)
    $maxAttempts = 2
    for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    $result = Invoke-NpmCommand -CommandArgs $Arguments
        if ($result.ExitCode -eq 0) {
            return
        }

        $message = ($result.Output | Out-String).Trim()
        if ($message -match '(?i)E(NOENT|ACCES|PERM)' -and $attempt -lt $maxAttempts) {
            Write-Warning ("Encountered access or permission error (attempt {0}). Cleaning npm cache before retry." -f $attempt)
            $cacheResult = Invoke-NpmCommand -Args @('cache', 'clean', '--force')
            if ($cacheResult.ExitCode -ne 0) {
                $cacheMessage = ($cacheResult.Output | Out-String).Trim()
                throw "npm cache clean --force failed: $cacheMessage"
            }
            Start-Sleep -Seconds 1
            Write-Host ("Retrying npm {0} (attempt {1} of {2})..." -f ($Arguments -join ' '), $attempt + 1, $maxAttempts)
            continue
        }

        if ($message) {
            throw ("npm {0} failed with exit code {1}: {2}" -f ($Arguments -join ' '), $result.ExitCode, $message)
        } else {
            throw ("npm {0} failed with exit code {1}." -f ($Arguments -join ' '), $result.ExitCode)
        }
    }

    throw ("npm {0} failed after {1} attempts." -f ($Arguments -join ' '), $maxAttempts)
}

function Print-DependencyGroup {
    param(
        [string]$Title,
        $DependencyObject
    )
    Write-Host ("{0}:" -f $Title)
    if ($null -eq $DependencyObject) {
        Write-Host "  (none)"
        return
    }

    if ($DependencyObject -is [System.Collections.IDictionary]) {
        if ($DependencyObject.Count -eq 0) {
            Write-Host "  (none)"
            return
        }
        foreach ($entry in ($DependencyObject.GetEnumerator() | Sort-Object Key)) {
            Write-Host ("  {0}: {1}" -f $entry.Key, $entry.Value)
        }
        return
    }

    $properties = @($DependencyObject.PSObject.Properties)
    if ($properties.Count -eq 0) {
        Write-Host "  (none)"
        return
    }
    foreach ($prop in ($properties | Sort-Object Name)) {
        Write-Host ("  {0}: {1}" -f $prop.Name, $prop.Value)
    }
}

try {
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        throw "npm is not installed or not available in PATH."
    }

    Invoke-NpmWithRetry -Arguments @(
        'install',
        '@clerk/nextjs',
        'drizzle-orm',
        'mysql2',
        'stripe',
        '@uploadthing/react',
        '@uploadthing/shared',
        'zod',
        '@vercel/analytics',
        'next-pwa'
    )

    Invoke-NpmWithRetry -Arguments @(
        'install',
        '-D',
        'drizzle-kit',
        '@types/node',
        '@types/react',
        '@types/react-dom',
        'tailwindcss-animate'
    )

    if (-not (Test-Path -LiteralPath 'package.json')) {
        throw "package.json not found in current directory."
    }

    $packageJsonRaw = Get-Content -LiteralPath 'package.json' -Raw
    try {
        $packageJson = $packageJsonRaw | ConvertFrom-Json
    } catch {
        throw "Failed to parse package.json: $($_.Exception.Message)"
    }

    Write-Host ""
    Write-Host "Dependency summary from package.json:"
    Print-DependencyGroup -Title 'dependencies' -DependencyObject $packageJson.dependencies
    Print-DependencyGroup -Title 'devDependencies' -DependencyObject $packageJson.devDependencies

    Write-Host ""
    Write-Host "[OK] Dependency installation complete."
} catch {
    $errMessage = $_.Exception.Message
    if ([string]::IsNullOrWhiteSpace($errMessage)) {
        $errMessage = $_ | Out-String
    }
    Write-Error $errMessage
    exit 1
}
