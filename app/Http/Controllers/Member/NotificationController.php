<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display the notifications page for member
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id_user;
        
        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return Inertia::render('Member/NotificationsMember', [
            'auth' => [
                'user' => $request->user()
            ],
            'notifications' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ]
        ]);
    }

    /**
     * Get all notifications for member
     */
    public function getNotifications(Request $request)
    {
        $userId = $request->user()->id_user;
        
        $query = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc');

        // Search filter
        if ($request->has('search') && $request->input('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Type filter
        if ($request->has('type') && $request->input('type')) {
            $query->where('type', $request->input('type'));
        }

        // Status filter
        if ($request->has('status') && $request->input('status')) {
            if ($request->input('status') === 'unread') {
                $query->where('is_read', false);
            } elseif ($request->input('status') === 'read') {
                $query->where('is_read', true);
            }
        }

        $notifications = $query->paginate(20);

        $unreadCount = Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'data' => $notifications->items(),
            'unread_count' => $unreadCount,
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ]
        ]);
    }

    /**
     * Mark a specific notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $userId = $request->user()->id_user;
        
        $notification = Notification::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();
        
        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read for member
     */
    public function markAllAsRead(Request $request)
    {
        $userId = $request->user()->id_user;
        
        Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Get notification statistics for member
     */
    public function getStats(Request $request)
    {
        $userId = $request->user()->id_user;
        
        $stats = [
            'total' => Notification::where('user_id', $userId)->count(),
            'unread' => Notification::where('user_id', $userId)->where('is_read', false)->count(),
            'read' => Notification::where('user_id', $userId)->where('is_read', true)->count(),
            'today' => Notification::where('user_id', $userId)
                ->whereDate('created_at', today())
                ->count(),
            'this_week' => Notification::where('user_id', $userId)
                ->whereBetween('created_at', [
                    now()->startOfWeek(),
                    now()->endOfWeek()
                ])
                ->count(),
        ];

        return response()->json($stats);
    }
}

