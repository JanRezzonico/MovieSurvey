$d = Get-Date -Format "yyyy-MM-dd";
$t = cat .\Template.md;
$t = $t.Replace("<DATA>", $d);
$fn = ($d + ".md");
New-Item -Name $fn;
$t >> $fn;