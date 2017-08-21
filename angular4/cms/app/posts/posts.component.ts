import { PostService } from './../services/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

    posts: any[];

    constructor(private service: PostService) { }

    ngOnInit() {
        this.service.getAll()
            .subscribe(posts => this.posts = posts)
    }

    createPost(input: HTMLInputElement) {
        let post = { title: input.value };
        this.posts.splice(0, 0, post);
        input.value = '';
        this.service.create(post)
            .subscribe(postCreate => {
                post['id'] = postCreate.id;
            }, error => {
                this.posts.splice(0, 1);
                throw error;
            })
    }

    updatePost(post) {
        this.service.update(post)
            .subscribe(post => {
                console.log(post);
            })
    }

    deletePost(post) {
        this.service.delete(post)
            .subscribe(() => {
                let index = this.posts.indexOf(post);
                this.posts.splice(index, 1);
            })
    }
}
