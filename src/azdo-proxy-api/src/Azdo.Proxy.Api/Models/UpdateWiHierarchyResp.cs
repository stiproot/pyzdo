
namespace Azdo.Proxy.Api.Models;

internal record UpdateWiHierarchyResp : Resp
{
    public UpdateWiHierarchyRes Res { get; init; } = new();
}
