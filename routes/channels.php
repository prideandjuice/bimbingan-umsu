<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('booking.{bookingId}', function ($user, $bookingId) {
    // Allows student or lecturer involved in the booking to listen
    return true; // Customize authorization as needed
});

Broadcast::channel('thesis.{thesisId}', function ($user, $thesisId) {
    return true;
});
