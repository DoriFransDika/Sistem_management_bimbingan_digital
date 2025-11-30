<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RatingController extends Controller
{
    public function index(Request $request)
    {
        $mentorId = $request->user()->id_user;

        $ratings = Rating::where('mentor_id', $mentorId)
            ->with(['member:id_user,name,email'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => $rating->id_rating,
                    'member_name' => optional($rating->member)->name,
                    'member_email' => optional($rating->member)->email,
                    'rating' => (float) $rating->rating,
                    'review' => $rating->review,
                    'created_at' => $rating->created_at,
                ];
            });

        $averageRating = $ratings->avg('rating') ?? 0;

        return Inertia::render('Mentor/RatingSaya', [
            'auth' => [
                'user' => $request->user(),
            ],
            'ratings' => $ratings,
            'stats' => [
                'average' => round($averageRating, 1),
                'count' => $ratings->count(),
            ],
        ]);
    }
}



