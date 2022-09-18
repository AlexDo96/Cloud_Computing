package com.example.messagingapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.example.messagingapplication.databinding.ActivityProfileBinding;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class ProfileActivity extends AppCompatActivity {
    // View Binding
    private ActivityProfileBinding binding;

    // Action bar
    private ActionBar actionBar;

    // Firebase Authentication
    private FirebaseAuth firebaseAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Configure action bar, title
        actionBar = getSupportActionBar();
        actionBar.setTitle("Profile");

        // Init firebase auth
        firebaseAuth = FirebaseAuth.getInstance();
        checkUser();

        // Logout user by clicking
        binding.logoutBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                firebaseAuth.signOut();
                checkUser();
            }
        });
    }

    private void checkUser() {
        // Check if user is not logged in then move to Login activity

        // Get current user
        FirebaseUser firebaseUser = firebaseAuth.getCurrentUser();
        if (firebaseUser == null){
            // User not logged in, move to login screen
            startActivity(new Intent(this,LoginActivity.class));
            finish();
        }else {
            // User logged in, get info
            String email = firebaseUser.getEmail();
            // Set to email textview
            binding.emailTv.setText(email);
        }
    }
}