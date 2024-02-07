
namespace Azdo.Proxy.Api.Models;

internal record UpdateWiReq : Req
{
    public UpdateWiCmd Cmd { get; init; } = new();
}