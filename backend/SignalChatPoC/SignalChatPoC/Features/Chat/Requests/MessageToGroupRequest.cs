namespace SignalChatPoC.Features.Chat.Requests;

public class MessageToGroupRequest
{
    public required string Content { get; set; }
    public DateTime SentAt { get; set; }
    public required string GroupName { get; set; }
}