
namespace azdo_proxy_api.Models;

internal record UpdateWiReq : Req
{
    public UpdateWiCmd Cmd { get; init; } = new();
}