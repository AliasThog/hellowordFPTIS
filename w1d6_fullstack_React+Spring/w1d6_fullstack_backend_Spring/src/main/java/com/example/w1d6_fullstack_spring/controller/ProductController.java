package com.example.w1d6_fullstack_spring.controller;

import com.example.w1d6_fullstack_spring.dto.ProductRequest;
import com.example.w1d6_fullstack_spring.dto.ProductResponse;
import com.example.w1d6_fullstack_spring.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> getProducts(@RequestParam(required = false) String search, @RequestParam(required = false) Long categoryId) {
        return productService.getProducts(search, categoryId);
    }

    @PostMapping
    public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return productService.createProduct(request);
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return productService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}