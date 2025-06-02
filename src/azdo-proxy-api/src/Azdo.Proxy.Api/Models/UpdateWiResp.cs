
namespace Azdo.Proxy.Api.Models;

internal record UpdateWiResp : Resp
{
    public UpdateWiRes Res { get; init; } = new();
}
