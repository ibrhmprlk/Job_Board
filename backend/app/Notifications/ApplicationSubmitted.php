<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ApplicationSubmitted extends Notification
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
        $applicant = $this->application->user;

        return (new MailMessage)
            ->subject('Yeni Başvuru: ' . $job->title)
            ->greeting('Merhaba ' . $notifiable->name . ',')
            ->line($applicant->name . ' adlı aday "' . $job->title . '" ilanınıza başvurdu.')
            ->line('Başvuru durumu: Beklemede')
            ->action('Başvuruyu İncele', url('/api/jobs/' . $job->id . '/applications'))
            ->line('İyi çalışmalar!');
    }
}