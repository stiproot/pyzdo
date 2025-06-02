
namespace Azdo.Proxy.Api.Models;

internal record CloneWiResp : Resp
{
    public CloneWiRes Res { get; init; } = new();
}