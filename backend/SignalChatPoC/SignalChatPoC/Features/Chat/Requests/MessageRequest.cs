namespace SignalChatPoC.Features.Chat.Requests;

public class MessageRequest
{
    public required string Content { get; set; }
    public DateTime SentAt { get; set; }
}
