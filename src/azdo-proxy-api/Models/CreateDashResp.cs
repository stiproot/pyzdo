
namespace azdo_proxy_api.Models;

internal record CreateDashResp : Resp
{
    public DashboardRes Res { get; init; } = new();
}