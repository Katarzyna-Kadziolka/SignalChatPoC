namespace SignalChatPoC.Features.Messages;

public class UserRemovedFromGroupMessage
{
    public string ConnectionId { get; set; }
    public string GroupName { get; set; }
}