using SignalChatPoC.Domain.Entities;

namespace SignalChatPoC.Features.Chat.Messages;

public class Message
{
    public Guid Id { get; set; }
    public required string Content { get; set; }
    public DateTime SentAt { get; set; }
    public string? GroupName { get; set; }
    
    public Guid SenderId { get; set; }
    public required User Sender { get; set; }
}