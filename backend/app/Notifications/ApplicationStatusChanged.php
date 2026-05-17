<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ApplicationStatusChanged extends Notification
{
    use Queueable;

    public function __construct(public JobApplication $application) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $job    = $this->application->jobListing;
        $status = $this->getStatusText();

        return (new MailMessage)
            ->subject('Başvurunuz Güncellendi: ' . $job->title)
            ->greeting('Merhaba ' . $notifiable->name . ',')
            ->line('"' . $job->title . '" pozisyonuna yaptığınız başvurunun durumu güncellendi.')
            ->line('Yeni durum: ' . $status)
            ->action('Başvurularımı Gör', url('/api/my-applications'))
            ->line('Başarılar dileriz!');
    }

    private function getStatusText(): string
    {
        return match($this->application->status) {
            'reviewing'   => '🔍 İnceleniyor',
            'shortlisted' => '⭐ Kısa Listeye Alındı',
            'rejected'    => '❌ Reddedildi',
            'hired'       => '🎉 İşe Alındı',
            default       => '⏳ Beklemede',
        };
    }
}
