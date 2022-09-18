package com.example.messagingapplication;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.example.messagingapplication.databinding.ActivitySignUpBinding;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class SignUpActivity extends AppCompatActivity {
    // View Binding
    private ActivitySignUpBinding binding;

    // Firebase Authentication
    private FirebaseAuth firebaseAuth;

    // Progress dialog
    private ProgressDialog progressDialog;

    // Action bar
    private ActionBar actionBar;

    private String phoneNumber = "", email = "", password = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySignUpBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Configure action bar, title and back button
        actionBar = getSupportActionBar();
        actionBar.setTitle("SignUp");
        actionBar.setDisplayHomeAsUpEnabled(true);
        actionBar.setDisplayShowHomeEnabled(true);

        // Init firebase auth
        firebaseAuth = FirebaseAuth.getInstance();

        // Configure progress dialog
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("Please wait");
        progressDialog.setMessage("Creating your account...");
        progressDialog.setCanceledOnTouchOutside(false);

        binding.signUpBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                validateData();
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed(); // Go to previous activity when back button of actionbar clicked
        return super.onSupportNavigateUp();
    }

    private void validateData() {
        // Get data
        email = binding.emailEt.getText().toString().trim();
        password = binding.passwordEt.getText().toString().trim();

        // Validate data
        if(!Patterns.EMAIL_ADDRESS.matcher(email).matches()){
            // Phone number format is invalid, not process further
            binding.emailEt.setError("Invalid phone number format");
        }else if(TextUtils.isEmpty(password)){
            // No password is entered
            binding.passwordEt.setError("Enter password");
        }else if(password.length() <6){
            // Password length less than 6
            binding.passwordEt.setError("Password must at least 6 chars");
        }else{
            // Data is valid, continue Firebase Signup
            firebaseSignUp();
        }
    }

    private void firebaseSignUp() {
        // Show progress;
        progressDialog.show();

        firebaseAuth.createUserWithEmailAndPassword(email, password)
                .addOnSuccessListener(new OnSuccessListener<AuthResult>() {
                    @Override
                    public void onSuccess(AuthResult authResult) {
                        // Signup success
                        progressDialog.dismiss();

                        // Get user info
                        FirebaseUser firebaseUser = firebaseAuth.getCurrentUser();
                        String email = firebaseUser.getEmail();
                        Toast.makeText(SignUpActivity.this,"Account created\n" + email,Toast.LENGTH_SHORT).show();

                        // Open Profile activity
                        startActivity(new Intent(SignUpActivity.this, ProfileActivity.class));
                        finish();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        // Signup fail
                        progressDialog.dismiss();
                        Toast.makeText(SignUpActivity.this,""+e.getMessage(),Toast.LENGTH_SHORT).show();
                    }
                });
    }
}