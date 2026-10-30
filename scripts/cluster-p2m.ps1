# Groupe les photos P2M par similarite visuelle (dHash 16x16) pour identifier
# uniquement les produits distincts au lieu de 136 doublons.
Add-Type -AssemblyName System.Drawing

function Get-DHash([string]$path) {
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $bmp = New-Object System.Drawing.Bitmap 17, 16
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, 17, 16)
    $g.Dispose()
    $bits = ''
    for ($y = 0; $y -lt 16; $y++) {
      for ($x = 0; $x -lt 16; $x++) {
        $l = $bmp.GetPixel($x, $y).R * 0.299 + $bmp.GetPixel($x, $y).G * 0.587 + $bmp.GetPixel($x, $y).B * 0.114
        $r = $bmp.GetPixel($x + 1, $y).R * 0.299 + $bmp.GetPixel($x + 1, $y).G * 0.587 + $bmp.GetPixel($x + 1, $y).B * 0.114
        if ($l -gt $r) { $bits += '1' } else { $bits += '0' }
      }
    }
    $bmp.Dispose()
    return $bits
  } finally { $img.Dispose() }
}

function Get-HashBytes([string]$bits) {
  $bytes = New-Object 'System.Byte[]' 32
  for ($i = 0; $i -lt 32; $i++) {
    $v = 0
    for ($b = 0; $b -lt 8; $b++) { if ($bits[$i * 8 + $b] -eq '1') { $v = $v -bor (1 -shl $b) } }
    $bytes[$i] = [byte]$v
  }
  return ,$bytes
}

function Get-Hamming($a, $b) {
  $d = 0
  for ($i = 0; $i -lt 32; $i++) {
    $x = $a[$i] -bxor $b[$i]
    while ($x -ne 0) { $d++; $x = $x -band ($x - 1) }
  }
  return $d
}

$files = Get-ChildItem 'public\images\reelles\p2m-*.jpg' | Sort-Object Name
$hashes = @{}
foreach ($f in $files) { $hashes[$f.Name] = Get-HashBytes (Get-DHash $f.FullName) }

# regroupement glouton: deux images sont "identiques" si distance <= 6
$groups = @()
$used = @{}
foreach ($f in $files) {
  if ($used.ContainsKey($f.Name)) { continue }
  $grp = @($f.Name)
  $used[$f.Name] = $true
  foreach ($g in $files) {
    if ($used.ContainsKey($g.Name)) { continue }
    if ((Get-Hamming $hashes[$f.Name] $hashes[$g.Name]) -le 6) {
      $grp += $g.Name
      $used[$g.Name] = $true
    }
  }
  $groups += ,@{rep = $f.Name; members = $grp}
}

$out = New-Object System.Collections.Generic.List[string]
$out.Add("DISTINCT_GROUPS=$($groups.Count)  TOTAL_IMAGES=$($files.Count)")
foreach ($g in $groups) {
  $out.Add("$($g.rep) <- " + ($g.members -join ','))
}
Set-Content -Path 'p2m-clusters.txt' -Value $out -Encoding utf8
Write-Output "wrote p2m-clusters.txt with $($groups.Count) groups"
