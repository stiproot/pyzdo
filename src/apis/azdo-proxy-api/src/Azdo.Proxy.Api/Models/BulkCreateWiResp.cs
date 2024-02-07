
namespace Azdo.Proxy.Api.Models;

internal record BulkCreateWiResp : Resp
{
    public IEnumerable<WiRes> Res { get; init; } = new List<WiRes>();
}