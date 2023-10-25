param (
    [Parameter(Mandatory=$true)]
    [string]$id
)

$name = "projectm-db-tmp-$id"
$img_name = "img-$name"

Write-Host "name: $name"
Write-Host "img_name: $img_name"

docker build -t $img_name .

docker run --network mandy -d --name $name `
    -p 8091-8097:8091-8097 `
    -p 9123:9123 `
    -p 11207:11207 `
    -p 11210:11210 `
    -p 11280:11280 `
    -p 18091-18097:18091-18097 `
    $img_name

# docker exec -it $name sh
