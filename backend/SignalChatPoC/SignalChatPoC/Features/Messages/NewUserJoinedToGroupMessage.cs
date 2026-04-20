namespace SignalChatPoC.Features.Messages;

public class NewUserJoinedToGroupMessage
{
    public string ConnectionId { get; set; }
    public string GroupName { get; set; }
}