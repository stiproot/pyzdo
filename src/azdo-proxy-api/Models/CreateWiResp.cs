
namespace azdo_proxy_api.Models;

internal record CreateWiResp : Resp
{
    public WiRes Res { get; init; } = new();
}