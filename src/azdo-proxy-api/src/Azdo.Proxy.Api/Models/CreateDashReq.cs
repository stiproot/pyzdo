
namespace Azdo.Proxy.Api.Models;

internal record CreateDashReq : Req
{
    public CreateDashboardWorkflowCmd Cmd { get; init; } = new();
}