
namespace azdo_proxy_api.Models;

internal record UpdateWiResp : Resp
{
    public UpdateWiRes Res { get; init; } = new();
}
