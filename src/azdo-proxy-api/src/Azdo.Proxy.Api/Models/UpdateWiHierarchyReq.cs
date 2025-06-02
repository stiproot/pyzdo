
namespace Azdo.Proxy.Api.Models;

internal record UpdateWiHierarchyReq : Req
{
    public UpdateWiHierarchyCmd Cmd { get; init; } = new();
}