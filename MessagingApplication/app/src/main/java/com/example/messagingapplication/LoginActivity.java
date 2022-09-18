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

import com.example.messagingapplication.databinding.ActivityLoginBinding;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class LoginActivity extends AppCompatActivity {
    // View Binding
    private ActivityLoginBinding binding;

    // Action bar
    private ActionBar actionBar;

    // Progress dialog
    private ProgressDialog progressDialog;

    // Firebase Authentication
    private FirebaseAuth firebaseAuth;

    private String phoneNumber = "", email = "", password = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Configure action bar, title
        actionBar = getSupportActionBar();
        actionBar.setTitle("Login");

        // Configure progress dialog
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("Please wait");
        progressDialog.setMessage("Logging In...");
        progressDialog.setCanceledOnTouchOutside(false);

        // Init firebase auth
        firebaseAuth = FirebaseAuth.getInstance();

        // Check User
        checkUser();

        //If not have account click to go to SignUp
        binding.notHaveAccountTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(LoginActivity.this, SignUpActivity.class));
            }
        });

        binding.loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Validate data
                validateData();
            }
        });
    }

    private void checkUser() {
        // Check if user is already logged in
        // If already logged in then open Profile activity

        // Get current user
        FirebaseUser firebaseUser = firebaseAuth.getCurrentUser();
        if (firebaseUser!= null){
            // User is already logged in
            startActivity(new Intent(this,ProfileActivity.class));
            finish();
        }
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
        }else{
            // Data is valid, continue Firebase Login
            firebaseLogin();
        }
    }

    private void firebaseLogin() {
        // Show progress
        progressDialog.show();

        firebaseAuth.signInWithEmailAndPassword(email, password)
                .addOnSuccessListener(new OnSuccessListener<AuthResult>() {
                    @Override
                    public void onSuccess(AuthResult authResult) {
                        // Login success
                        // Get user info
                        FirebaseUser firebaseUser = firebaseAuth.getCurrentUser();
                        String email = firebaseUser.getEmail();
                        Toast.makeText(LoginActivity.this,"Logged In\n" + email,Toast.LENGTH_SHORT).show();

                        // Open Profile activity
                        startActivity(new Intent(LoginActivity.this, ProfileActivity.class));
                        finish();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        // Login fail
                        progressDialog.dismiss();
                        Toast.makeText(LoginActivity.this,""+e.getMessage(),Toast.LENGTH_SHORT).show();
                    }
                });
    }
}