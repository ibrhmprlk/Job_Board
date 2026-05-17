<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ApplicationReceived extends Notification
{
    use Queueable;

    public function __construct(public JobApplication $application) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $job     = $this->application->jobListing;
        $company = $job->company;

        return (new MailMessage)
            ->subject('Başvurunuz Alındı: ' . $job->title)
            ->greeting('Merhaba ' . $notifiable->name . ',')
            ->line('"' . $job->title . '" pozisyonu için ' . $company->name . ' şirketine yaptığınız başvuru başarıyla alındı.')
            ->line('Başvuru durumunuz: ⏳ Beklemede')
            ->line('İşveren başvurunuzu incelediğinde size bildirim göndereceğiz.')
            ->action('Başvurularımı Gör', url('/api/my-applications'))
            ->line('Başarılar dileriz!');
    }
}