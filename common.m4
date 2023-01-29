define(`EXEC',`translit(esyscmd($1),`
')')dnl
define(`TIMESTAMP',EXEC(`date'))dnl
define(`VERSION',EXEC(`git describe --tags'))dnl
