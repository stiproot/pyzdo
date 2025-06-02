
namespace azdo_proxy_api.Models;

internal record CloneWiResp : Resp
{
    public CloneWiRes Res { get; init; } = new();
}