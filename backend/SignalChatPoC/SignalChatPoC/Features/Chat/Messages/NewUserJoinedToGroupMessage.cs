namespace SignalChatPoC.Features.Chat.Messages;

public class NewUserJoinedToGroupMessage
{
    public required string ConnectionId { get; set; }
    public required string GroupName { get; set; }
}