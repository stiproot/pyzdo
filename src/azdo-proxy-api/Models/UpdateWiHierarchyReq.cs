
namespace azdo_proxy_api.Models;

internal record UpdateWiHierarchyReq : Req
{
    public UpdateWiHierarchyCmd Cmd { get; init; } = new();
}