
namespace Azdo.Proxy.Api.Models;

internal record CloneWiReq : Req
{
    public CloneWiCmd Cmd { get; init; } = new();
}