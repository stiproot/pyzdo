
namespace azdo_proxy_api.Models;

internal record CloneWiReq : Req
{
    public CloneWiCmd Cmd { get; init; } = new();
}