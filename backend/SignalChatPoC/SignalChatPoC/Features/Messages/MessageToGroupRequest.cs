namespace SignalChatPoC.Features.Messages;

public class MessageToGroupRequest
{
    public required string Content { get; set; }
    public DateTime SentAt { get; set; }
    public required string GroupName { get; set; }
}