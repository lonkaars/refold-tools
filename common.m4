define(`EXEC',`translit(esyscmd($1),`
')')dnl
define(`TIMESTAMP',EXEC(`date --utc --rfc-3339=seconds'))dnl
define(`VERSION',EXEC(`git describe --tags'))dnl
