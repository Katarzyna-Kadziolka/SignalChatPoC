namespace SignalChatPoC.Features.Chat.Messages;

public class UserRemovedFromGroupMessage
{
    public required string ConnectionId { get; set; }
    public required string GroupName { get; set; }
}