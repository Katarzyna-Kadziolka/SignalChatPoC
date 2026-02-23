namespace SignalChatPoC.Domain.Entities;

public class Message
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime SentAt { get; set; }
    
    public Guid SenderId { get; set; }
    public User Sender { get; set; }
}