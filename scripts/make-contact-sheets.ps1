# Genere des planches-contacts numerotees des photos produits P2M
# afin de pouvoir identifier visuellement chaque article.
Add-Type -AssemblyName System.Drawing

$srcDir = Join-Path $PSScriptRoot '..\public\images\reelles'
$outDir = Join-Path $PSScriptRoot '..\tmp-sheets'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$files = Get-ChildItem (Join-Path $srcDir 'p2m-*.jpg') | Sort-Object Name
$cellW = 300
$cellH = 400
$labelH = 34
$cols = 5
$rows = 3
$perSheet = $cols * $rows
$sheetW = $cols * $cellW
$sheetH = $rows * ($cellH + $labelH)

$font = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
$labelBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 200, 30, 30))
$labelFg = [System.Drawing.Brushes]::White
$cellBg = [System.Drawing.Brushes]::White
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 120, 120, 120), 2)

$sheetIndex = 0
for ($i = 0; $i -lt $files.Count; $i += $perSheet) {
  $sheetIndex++
  $batch = $files[$i..([Math]::Min($i + $perSheet - 1, $files.Count - 1))]
  $bmp = New-Object System.Drawing.Bitmap($sheetW, $sheetH)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(255, 235, 235, 235))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  for ($k = 0; $k -lt $batch.Count; $k++) {
    $col = $k % $cols
    $row = [Math]::Floor($k / $cols)
    $x = $col * $cellW
    $y = $row * ($cellH + $labelH)
    $img = [System.Drawing.Image]::FromFile($batch[$k].FullName)
    $scale = [Math]::Min($cellW / $img.Width, $cellH / $img.Height)
    $w = [int]($img.Width * $scale)
    $h = [int]($img.Height * $scale)
    $ox = $x + [int](($cellW - $w) / 2)
    $oy = $y + $labelH + [int](($cellH - $h) / 2)
    $g.DrawImage($img, $ox, $oy, $w, $h)
    $img.Dispose()
    # etiquette numero (index global 1-based + nom fichier)
    $g.FillRectangle($labelBg, $x, $y, $cellW, $labelH)
    $num = ($i + $k + 1)
    $g.DrawString(([string]$num).PadLeft(3, '0'), $font, $labelFg, ($x + 6), ($y + 3))
    $g.DrawString($batch[$k].Name, (New-Object System.Drawing.Font('Arial', 11)), $labelFg, ($x + 70), ($y + 7))
    $g.DrawRectangle($borderPen, $x, $y, $cellW - 1, ($cellH + $labelH) - 1)
  }

  $g.Dispose()
  $out = Join-Path $outDir ('sheet-{0:D2}.jpg' -f $sheetIndex)
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
  Write-Output "$out  ($($batch.Count) images)"
}
$borderPen.Dispose()
Write-Output "TOTAL sheets: $sheetIndex"
