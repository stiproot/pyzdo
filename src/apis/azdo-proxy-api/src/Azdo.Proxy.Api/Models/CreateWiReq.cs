
namespace Azdo.Proxy.Api.Models;

internal record CreateWiReq : Req
{
    public CreateWiCmd Cmd { get; init; } = new();
}